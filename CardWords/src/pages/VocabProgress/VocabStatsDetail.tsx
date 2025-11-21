import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVocabProgressStore } from '../../store/vocabProgressStore';
import {
  BookOpen,
  ArrowLeft,
  Users,
  Target,
  CheckCircle,
  XCircle,
  BarChart3,
  AlertTriangle
} from 'lucide-react';

const VocabStatsDetail: React.FC = () => {
  const { vocabId } = useParams<{ vocabId: string }>();
  const navigate = useNavigate();
  const {
    vocabStats,
    loading,
    error,
    fetchVocabStats
  } = useVocabProgressStore();

  useEffect(() => {
    if (vocabId) {
      fetchVocabStats(vocabId);
    }
  }, [vocabId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Đã xảy ra lỗi</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => vocabId && fetchVocabStats(vocabId)}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!vocabStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy thống kê</h2>
          <button
            onClick={() => navigate('/admin/vocab-progress')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/admin/vocab-progress')}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Quay lại
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BookOpen className="h-8 w-8 mr-3 text-blue-600" />
                Thống Kê Từ Vựng
              </h1>
              <p className="text-gray-600 mt-1">
                Vocab ID: {vocabStats.vocabId}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng người học</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {vocabStats.totalLearners.toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng lượt làm</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {vocabStats.totalAttempts.toLocaleString()}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Độ chính xác</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {vocabStats.accuracy.toFixed(1)}%
                </p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
            Chi Tiết Thống Kê
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Correct Answers */}
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Câu trả lời đúng</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">
                    {vocabStats.totalCorrect.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    {vocabStats.totalAttempts > 0 
                      ? ((vocabStats.totalCorrect / vocabStats.totalAttempts) * 100).toFixed(1)
                      : 0
                    }% tổng lượt làm
                  </p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>

            {/* Wrong Answers */}
            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800">Câu trả lời sai</p>
                  <p className="text-3xl font-bold text-red-900 mt-2">
                    {vocabStats.totalWrong.toLocaleString()}
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    {vocabStats.totalAttempts > 0 
                      ? ((vocabStats.totalWrong / vocabStats.totalAttempts) * 100).toFixed(1)
                      : 0
                    }% tổng lượt làm
                  </p>
                </div>
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Tỷ lệ chính xác</span>
              <span className="text-sm font-semibold text-gray-900">
                {vocabStats.accuracy.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${vocabStats.accuracy}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Tổng lượt tương tác</p>
              <p className="text-lg font-semibold text-gray-900">
                {vocabStats.totalAttempts.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Số người đã học</p>
              <p className="text-lg font-semibold text-gray-900">
                {vocabStats.totalLearners.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Tỷ lệ thành công</p>
              <p className="text-lg font-semibold text-green-600">
                {vocabStats.accuracy.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabStatsDetail;